from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from account.models import Word

from .serializers import WordSerializer

from .words import get_random



class GameAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, r, *args, **kwargs):
        user = r.user
        for_ = r.GET.get('for')
        match for_:
            case 'wordlen':
                word = user.getTodaysWord
                if not word:
                    newword = Word.objects.create(
                        user=user,
                        text=get_random()
                    )
                    newword.save()
                    data=len(newword.text)
                else: data=len(word.text)
            case 'progress':
                word = user.getTodaysWord
                letters = index_list(word.text, word.letters)
                data = {"found":letters, "attempts":word.wrong_attempts}
            case 'buyletter':
                print('buying letter')
                word = user.getTodaysWord
                l_ind = int(r.GET.get('i'))
                if word.text[l_ind] in word.letters:
                    data = {"detail":"This letter has already been found"}
                    return Response(data=data)
                
                word.letters.append(word.text[l_ind])
                print('saving')
                word.save()
                print('saved')
                data = index_list(word.text, list(word.text[l_ind]))
            case 'tryletter':
                word = user.getTodaysWord
                l = r.GET.get('l').lower()
                print(word.letters)
                if l in word.letters:
                    data = {'detail': 'This letter has already been found'}
                elif l in word.wrong_attempts:
                    data = {'detail': 'This letter has already been tried'}
                elif l not in word.text:
                    data = {"detail":"Wrong attempt"}
                    word.wrong_attempts.append(l)
                    word.save()
                else:
                    word.letters.append(l)
                    word.save()
                    data = index_list(word.text, [l])

        return Response(data=data)







class WordListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = WordSerializer

    def get_queryset(self):
        return Word.objects.all(user=self.request.user)
    
class WordRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WordSerializer

    def get_queryset(self):
        return Word.objects.all(user=self.request.user)




def index_list(i, l):
    result = {}
    for i, char in enumerate(i):
        if char in l:
            if char not in result:
                result[char] = []
            result[char].append(i)
    return result